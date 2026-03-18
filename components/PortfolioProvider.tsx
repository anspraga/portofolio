'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface LocalizedText { id: string; en: string; }

export interface Profile {
  id: number;
  full_name: string;
  title: LocalizedText;
  available_for_work: boolean;
  email: string;
  location: string;
  hero_desc: LocalizedText;
  about: LocalizedText;
  about_image: string;
  resume_url: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
  highlight_tags: string[];
}

export interface Skill {
  id: number;
  name: string;
  icon_name: string;
  category: string;
  color: string;
}

export interface Project {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  status: string;
  featured: boolean;
}

export interface Certification {
  id: number;
  title: LocalizedText;
  issuer: string;
  date: LocalizedText;
  image: string;
  link: string;
  description: LocalizedText;
}

interface PortfolioData {
  profile: Profile | null;
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  error: string | null;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: { profile: null, skills: [], projects: [], certifications: [] },
  isLoading: true,
  error: null,
});

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>({ profile: null, skills: [], projects: [], certifications: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/portfolio`)
      .then(res => res.json())
      .then(resData => {
        if (resData.error) throw new Error(resData.error);
        setData({
          profile: resData.profile || null,
          skills: resData.skills || [],
          projects: resData.projects || [],
          certifications: resData.certifications || []
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Gagal load dari Go Backend:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, isLoading, error }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
