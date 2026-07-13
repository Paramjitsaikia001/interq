const steps = [
  {
    title: 'Share Questions',
    description: 'Contribute your recent interview experience.',
  },
  {
    title: 'Verify',
    description: 'Community experts validate the technical accuracy.',
  },
  {
    title: 'Learn',
    description: 'Browse verified solutions and company trends.',
  },
  {
    title: 'Contribute',
    description: 'Help others by providing alternative solutions.',
  },
  {
    title: 'Prepare Better',
    description: 'Succeed in your next big technical challenge.',
  }
];

export function Timeline() {
  return (
    <section className="max-w-5xl mx-auto w-full pt-20">
      <h2 className="text-2xl font-bold text-center mb-12 text-foreground">
        The Cycle of Intelligence
      </h2>
      
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
        {/* Horizontal line for desktop */}
        <div className="hidden md:block absolute top-6 left-0 right-0 h-[2px] bg-border z-0" />
        
        {/* Vertical line for mobile */}
        <div className="block md:hidden absolute top-0 bottom-0 left-6 w-[2px] bg-border z-0" />

        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex md:flex-col items-center md:text-center gap-4 md:gap-4 w-full md:w-48">
            <div className="w-12 h-12 rounded-full bg-background border-[2px] border-primary text-primary flex items-center justify-center font-bold text-lg shrink-0">
              {index + 1}
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1 text-foreground">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
