import { useEffect, useRef } from 'react'

export default function FadeIn({ children, className = '', as: Tag = 'div', ...props }) {
  const element_ref = useRef(null)
  useEffect(() => {
    const element = element_ref.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        element.animate(
          [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 500, easing: 'cubic-bezier(.2, .65, .3, 1)' },
        )
        observer.disconnect()
      }
    }, { threshold: 0.01 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return <Tag ref={element_ref} className={className} {...props}>{children}</Tag>
}
