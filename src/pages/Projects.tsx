import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectApi } from '../services/api';
import { Project } from '../types';
import { ExternalLink, FolderGit2, Search, Filter, Star, ChevronRight } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    projectApi.getAll().then(res => {
      setProjects(res.data);
      setFiltered(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = projects;
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [activeCategory, searchQuery, projects]);

  const categories = ['All', ...new Set(projects.map(p => p.category))];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mt-4 mb-4">My <span className="gradient-text">Projects</span></h1>
        </div>

        {loading ? (
          <div className="text-white text-center">Loading Projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="glass-light rounded-2xl overflow-hidden group">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={project.image || 'https://via.placeholder.com/800x450?text=No+Image+Found'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=Error+Loading+Image'; }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-dark-400 text-sm line-clamp-2">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}