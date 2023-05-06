import { motion } from 'framer-motion';
import Logo from './Logo';

export default function Loader() {
  return (
    <>
      <motion.div
        className="flex justify-center items-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <Logo />
      </motion.div>
    </>
  );
}
