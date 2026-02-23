import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DeveloperSection } from '../components/DeveloperSection';
import { motion } from 'framer-motion';

export default function AboutPage() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[calc(100vh-64px)] p-4 md:p-8 pt-6 max-w-7xl mx-auto"
        >
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors flex-shrink-0"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    About GravityPDF
                </h1>
            </div>

            <div className="w-full h-full flex items-center justify-center pt-10">
                <DeveloperSection forceNativeShow={true} />
            </div>
        </motion.div>
    );
}
