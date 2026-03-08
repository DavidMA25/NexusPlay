import { Twitter, Youtube, Twitch, MessageSquare } from 'lucide-react';

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
                            <li><a href="#" className="hover:text-brand-red transition-colors">Find Players</a></li>
                            <li><a href="#" className="hover:text-brand-red transition-colors">Find Teams</a></li>
                            <li><a href="#" className="hover:text-brand-red transition-colors">Events</a></li>
                            <li><a href="#" className="hover:text-brand-red transition-colors">News</a></li>
                        </ul>
                    </div>

                    {/* Columna 2: Company */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-brand-red transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-brand-red transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-brand-red transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-brand-red transition-colors">Press Kit</a></li>
                        </ul>
                    </div>

                    {/* Columna 3: Resources */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-brand-red transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-brand-red transition-colors">Community</a></li>
                            <li><a href="#" className="hover:text-brand-red transition-colors">Guidelines</a></li>
                            <li><a href="#" className="hover:text-brand-red transition-colors">API</a></li>
                        </ul>
                    </div>

                    {/* Columna 4: Legal */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-brand-red transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-brand-red transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-brand-red transition-colors">Cookie Policy</a></li>
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