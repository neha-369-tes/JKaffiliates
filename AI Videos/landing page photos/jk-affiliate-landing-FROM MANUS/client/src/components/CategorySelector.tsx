import { motion } from 'framer-motion';

interface CategorySelectorProps {
  activeCategory: 'women' | 'men';
  onCategoryChange: (category: 'women' | 'men') => void;
}

/**
 * Category Selector Component
 * 
 * Design: Luxury Fashion Editorial
 * - Fixed position at top after first scroll
 * - Smooth slide animation on toggle
 * - Purple active state, gray inactive state
 * - Accessible keyboard navigation
 */
export const CategorySelector = ({
  activeCategory,
  onCategoryChange,
}: CategorySelectorProps) => {
  const categories: Array<'women' | 'men'> = ['women', 'men'];

  return (
    <motion.div
      className="fixed top-8 left-1/2 z-50 transform -translate-x-1/2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20">
        <div className="flex gap-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 font-semibold text-sm tracking-widest transition-all duration-300 uppercase ${
                activeCategory === category
                  ? 'text-primary'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-pressed={activeCategory === category}
              aria-label={`Switch to ${category} collection`}
            >
              {category}
              {activeCategory === category && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="underline"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategorySelector;
