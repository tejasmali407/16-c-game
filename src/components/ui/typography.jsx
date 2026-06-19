import { cn } from '@/lib/utils';

const headingMap = {
  xl: 'h1',
  lg: 'h2',
  md: 'h3',
};

const headingClass = {
  xl: 'text-heading-xl',
  lg: 'text-heading-lg',
  md: 'text-heading-md',
};

export function Heading({ level = 'lg', children, className, as }) {
  const Tag = as ?? headingMap[level] ?? 'h2';
  return <Tag className={cn(headingClass[level], className)}>{children}</Tag>;
}

export function HeadingXL(props) {
  return <Heading level="xl" {...props} />;
}

export function HeadingLG(props) {
  return <Heading level="lg" {...props} />;
}

export function HeadingMD(props) {
  return <Heading level="md" {...props} />;
}

export function Body({ children, className, as: Tag = 'p' }) {
  return <Tag className={cn('text-body', className)}>{children}</Tag>;
}

export function SmallText({ children, className, as: Tag = 'p' }) {
  return <Tag className={cn('text-small', className)}>{children}</Tag>;
}
