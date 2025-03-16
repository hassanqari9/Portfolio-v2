import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Calendar, ExternalLink, Github, MapPin, Mail, Linkedin, Twitter } from "lucide-react";

export default async function Home() {
  // Fetch data from the database
  const about = await prisma.about.findFirst();
  const skills = await prisma.skill.findMany();
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: 'desc' }
  });
  const projects = await prisma.project.findMany();
  const contact = await prisma.contact.findFirst();
  const certificates = await prisma.certificate.findMany({
    orderBy: { date: 'desc' }
  });

  // Group skills by category
  const skillCategories = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-900">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-white">
              {about?.title || "Welcome to My Portfolio"}
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
              {about?.description || "I'm a passionate professional showcasing my work and experience."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="default" size="lg" className="rounded-md">
                <a href="#contact" className="flex items-center gap-2">
                  Get in Touch <ArrowRight size={16} />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="rounded-md">
                <a href="#projects" className="flex items-center gap-2">
                  View Projects <ArrowRight size={16} />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-white">
              About Me
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                  {about?.description || "I'm a passionate professional with expertise in various technologies and a drive for creating impactful solutions."}
                </p>
                <Button className="rounded-md">
                  <a href="#contact" className="flex items-center gap-2">
                    Contact Me <ArrowRight size={16} />
                  </a>
                </Button>
              </div>
              <div className="flex justify-center">
                {about?.image ? (
                  <img 
                    src={about.image} 
                    alt="Profile" 
                    className="rounded-md shadow-md max-w-[300px] w-full h-auto object-cover aspect-square" 
                  />
                ) : (
                  <div className="w-[300px] h-[300px] bg-zinc-100 dark:bg-zinc-800 rounded-md flex items-center justify-center">
                    <span className="text-zinc-400">Profile Image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-white">
              Skills
            </h2>
            
            <Tabs defaultValue={Object.keys(skillCategories)[0] || "all"} className="w-full">
              <TabsList className="flex mb-8 flex-wrap">
                {Object.keys(skillCategories).map((category) => (
                  <TabsTrigger key={category} value={category} className="rounded-md">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(skillCategories).map(([category, categorySkills]) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <div className="font-medium text-zinc-900 dark:text-white mb-1">{skill.name}</div>
                        {skill.level && (
                          <div className="mt-2">
                            <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-zinc-900 dark:bg-zinc-400 rounded-full" 
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-white">
              Experience
            </h2>
            
            <div className="space-y-12">
              {experiences.length > 0 ? (
                experiences.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/3">
                        <div className="flex items-center gap-3">
                          {exp.logo ? (
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={exp.logo} alt={exp.company} />
                              <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">{exp.company.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">{exp.company.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <h3 className="font-medium text-zinc-900 dark:text-white">{exp.company}</h3>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400">
                              {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - {
                                exp.current 
                                  ? 'Present' 
                                  : exp.endDate 
                                    ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                    : 'Present'
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <h4 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">{exp.position}</h4>
                        {exp.location && (
                          <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                            <MapPin size={14} />
                            <span>{exp.location}</span>
                          </div>
                        )}
                        <p className="text-zinc-600 dark:text-zinc-400">{exp.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-md">
                  <p className="text-zinc-600 dark:text-zinc-400">Experience information will be added soon.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-white">
              Projects
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project.id} className="group">
                    <div className="overflow-hidden rounded-md mb-4">
                      {project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <span className="text-zinc-400">Project Image</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-medium text-zinc-900 dark:text-white mb-2">{project.title}</h3>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.split(',').map((tech, index) => (
                          <span key={index} className="inline-block px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">{project.description}</p>
                    <div className="flex gap-3">
                      {project.link && (
                        <Button variant="outline" size="sm" className="rounded-md" asChild>
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                            <ExternalLink size={14} /> View
                          </a>
                        </Button>
                      )}
                      {project.github && (
                        <Button variant="outline" size="sm" className="rounded-md" asChild>
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                            <Github size={14} /> Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-md">
                  <p className="text-zinc-600 dark:text-zinc-400">Project information will be added soon.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Certificates Section */}
        <section id="certificates" className="py-20 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-white">
              Certificates
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.length > 0 ? (
                certificates.map((cert) => (
                  <div key={cert.id} className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-md">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={16} className="text-zinc-500 dark:text-zinc-400" />
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(cert.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-1">{cert.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-2">{cert.issuer}</p>
                    {cert.description && (
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm">{cert.description}</p>
                    )}
                    {cert.link && (
                      <Button variant="outline" size="sm" className="rounded-md" asChild>
                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          <ExternalLink size={14} /> View Certificate
                        </a>
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-md">
                  <p className="text-zinc-600 dark:text-zinc-400">Certificate information will be added soon.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-white">
              Contact
            </h2>
            
            <div className="max-w-2xl">
              {contact ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-4">Get in touch</h3>
                    <div className="space-y-4">
                      <div>
                        <a 
                          href={`mailto:${contact.email}`} 
                          className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          <Mail size={16} />
                          {contact.email}
                        </a>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      {contact.address && (
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                          <span>{contact.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-4">Find me on</h3>
                    <div className="flex gap-4">
                      {contact.github && (
                        <a 
                          href={contact.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                          aria-label="GitHub"
                        >
                          <Github size={20} />
                        </a>
                      )}
                      {contact.linkedin && (
                        <a 
                          href={contact.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin size={20} />
                        </a>
                      )}
                      {contact.twitter && (
                        <a 
                          href={contact.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                          aria-label="Twitter"
                        >
                          <Twitter size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-md">
                  <p className="text-zinc-600 dark:text-zinc-400">Contact information will be added soon.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
