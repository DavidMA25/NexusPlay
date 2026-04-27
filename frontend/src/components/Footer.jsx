import { Twitter, Youtube, Twitch, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0a] border-t border-gray-800 pt-16 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Grid principal: Logo/Desc + 4 Columnas de links */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">

                    {/* Columna del Logo y Redes (ocupa 2 columnas en pantallas grandes) */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center text-white font-bold">N</div>
                            <span className="text-white text-xl font-bold">NexusPlay</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-8 max-w-xs">
                            The professional hub for eSports recruitment. Connecting players, teams, and organizations worldwide.
                        </p>
                        {/* Iconos sociales con hover rojo */}
                        <div className="flex gap-4">
                            {[Twitter, Youtube, Twitch, MessageSquare].map((Icon, i) => (
                                <a key={i} href="#" className="p-2 bg-[#1a1a1a] rounded-lg text-gray-400 hover:text-brand-red transition-colors">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Columna 1: Platform */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/dashboard/players" className="hover:text-brand-red transition-colors">Find Players</Link></li>
                            <li><Link to="/dashboard/teams" className="hover:text-brand-red transition-colors">Find Teams</Link></li>
                            <li><Link to="/dashboard/events" className="hover:text-brand-red transition-colors">Events</Link></li>
                            <li><a href={import.meta.env.VITE_WP_URL || 'http://localhost/wordpress'} target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">News</a></li>
                        </ul>
                    </div>

                    {/* Columna 2: Company */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-brand-red transition-colors">About Us</Link></li>
                            <li><Link to="/" className="hover:text-brand-red transition-colors">Careers</Link></li>
                            <li><a href={import.meta.env.VITE_WP_URL || 'http://localhost/wordpress'} target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">Blog</a></li>
                            <li><Link to="/" className="hover:text-brand-red transition-colors">Press Kit</Link></li>
                        </ul>
                    </div>

                    {/* Columna 3: Resources */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-brand-red transition-colors">Help Center</Link></li>
                            <li><Link to="/" className="hover:text-brand-red transition-colors">Community</Link></li>
                            <li><Link to="/" className="hover:text-brand-red transition-colors">Guidelines</Link></li>
                            <li><Link to="/" className="hover:text-brand-red transition-colors">API</Link></li>
                        </ul>
                    </div>

                    {/* Columna 4: Legal */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-brand-red transition-colors">Terms of Service</Link></li>
                            <li><Link to="/" className="hover:text-brand-red transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/" className="hover:text-brand-red transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Barra inferior de Copyright */}
                <div className="pt-8 border-t border-gray-900 text-xs text-gray-500">
                    <p>© 2026 NexusPlay. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}