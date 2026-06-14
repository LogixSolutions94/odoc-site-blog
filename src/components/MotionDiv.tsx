import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  forceAnimate?: boolean;
}

const defaultTransition = {
  duration: 0.55,
  ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
};

export const MotionDiv = ({ children, forceAnimate, ...props }: MotionDivProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if already visible at load time
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setInView(true);
      return;
    }

    // Setup IntersectionObserver for scroll-triggered animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // prefers-reduced-motion : contenu immédiatement visible, aucune animation.
  if (reduce) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { initial, animate, transition, whileInView, exit, ...rest } = props;
    return (
      <motion.div ref={ref} initial={false} animate={{ opacity: 1, y: 0 }} {...rest}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={props.transition || defaultTransition}
      {...props}
    >
      {children}
    </motion.div>
  );
};
