import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { redis } from '@/lib/redis';

// GET /api/v1/admin/companies - Retrieves all companies (optionally including soft-deleted ones)
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const where: any = {};
    if (!includeDeleted) {
      where.deletedAt = null;
    }

    const companies = await prisma.company.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { questions: { where: { deletedAt: null } } }
        }
      }
    });

    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin companies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/v1/admin/companies - Creates a new company
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, logoUrl, description, website, industry, location, employeeCount } = body;

    if (!name || !description || !website || !industry || !location || !employeeCount) {
      return NextResponse.json({ error: 'Bad Request: Missing required fields' }, { status: 400 });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if slug/name already exists (including soft-deleted)
    const existing = await prisma.company.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { slug }
        ]
      }
    });

    if (existing) {
      if (existing.deletedAt) {
        // If it was soft-deleted, we can restore it!
        const restored = await prisma.company.update({
          where: { id: existing.id },
          data: {
            deletedAt: null,
            logoUrl: logoUrl || existing.logoUrl,
            description,
            website,
            industry,
            location,
            employeeCount,
          }
        });
        return NextResponse.json({ success: true, company: restored, message: 'Restored previously deleted company' }, { status: 200 });
      }
      return NextResponse.json({ error: 'Conflict: Company name or slug already exists' }, { status: 409 });
    }

    const newCompany = await prisma.company.create({
      data: {
        name,
        slug,
        logoUrl: logoUrl || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150',
        description,
        website,
        industry,
        location,
        employeeCount,
        rating: 0.0,
      }
    });

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/v1/admin/companies - Updates company details or restores it
export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { companyId, action, name, logoUrl, description, website, industry, location, employeeCount } = body;

    if (!companyId) {
      return NextResponse.json({ error: 'Bad Request: companyId is required' }, { status: 400 });
    }

    const targetCompany = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!targetCompany) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    let updatedCompany;

    if (action === 'restore') {
      updatedCompany = await prisma.company.update({
        where: { id: companyId },
        data: { deletedAt: null }
      });
    } else if (action === 'soft_delete') {
      updatedCompany = await prisma.company.update({
        where: { id: companyId },
        data: { deletedAt: new Date() }
      });
    } else {
      // General update
      const updateData: any = {};
      if (name) {
        updateData.name = name;
        updateData.slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
      if (description !== undefined) updateData.description = description;
      if (website !== undefined) updateData.website = website;
      if (industry !== undefined) updateData.industry = industry;
      if (location !== undefined) updateData.location = location;
      if (employeeCount !== undefined) updateData.employeeCount = employeeCount;

      updatedCompany = await prisma.company.update({
        where: { id: companyId },
        data: updateData
      });
    }

    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
