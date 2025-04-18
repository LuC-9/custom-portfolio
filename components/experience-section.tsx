import { Briefcase } from "lucide-react"
import { AnimatedSectionHeading } from "@/components/animated-section-heading"

type ExperienceItem = {
  id: string
  title: string
  company?: string
  team?: string
  platform?: string
  community?: string
  period: string
  content: string
  skills?: string[] // Add skills array
}

export function ExperienceSection({
  experiences,
  isDeveloper,
}: { experiences: ExperienceItem[]; isDeveloper: boolean }) {
  return (
    <section className="py-8">
      <AnimatedSectionHeading title="My Experience" icon={Briefcase} />

      <div className="timeline">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative">
            <div className="timeline-dot">
              <Briefcase size={14} />
            </div>

            <div className="experience-card group/exp relative overflow-hidden">
              <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
              <p className="text-muted-foreground mb-2">
                {isDeveloper ? exp.company : exp.team || exp.platform || exp.community || "Gaming Organization"}
              </p>
              <p className="experience-date mb-4">{exp.period}</p>
              <div dangerouslySetInnerHTML={{ __html: exp.content }} />
              
              {/* Display skills without heading */}
              {exp.skills && exp.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md relative overflow-hidden group/tag"
                    >
                      <span className="relative z-10">{skill}</span>
                      <span className="absolute inset-0 opacity-0 group-hover/tag:opacity-100 bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 transition-opacity duration-300"></span>
                    </span>
                  ))}
                </div>
              )}
              
              {/* Add subtle gradient effect on card hover */}
              <span className="absolute inset-0 opacity-0 group-hover/exp:opacity-100 bg-gradient-to-b from-primary/5 to-transparent transition-opacity duration-300"></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}






