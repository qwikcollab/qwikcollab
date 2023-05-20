import { motion } from 'framer-motion';
import Logo from './Logo';

export default function Loader() {
  return (
    <div className={'lg:w-20 lg:h-20 mx-auto static'}>
      <motion.div
        className="flex justify-center items-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Logo width={400} height={400} />
      </motion.div>
      <div className={'text-center mt-5'}> Loading... </div>
    </div>
  );
}
