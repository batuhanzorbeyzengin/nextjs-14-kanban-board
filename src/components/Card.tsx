import { ReactNode, FC } from 'react';
import classNames from 'classnames';

interface BaseProps {
  children?: ReactNode;
  className?: string;
}

const Card: FC<BaseProps> = ({ children, className }) => {
  return (
    <div className={classNames('rounded-lg border bg-card text-card-foreground shadow-sm mx-auto max-w-sm', className)}>
      {children}
    </div>
  );
};

const CardHeader: FC<BaseProps> = ({ children, className }) => {
  return (
    <div className={classNames('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  );
};

const CardBody: FC<BaseProps> = ({ children, className }) => {
  return (
    <div className={classNames('p-6 pt-0 grid gap-4', className)}>
      {children}
    </div>
  );
};

const CardFooter: FC<BaseProps> = ({ children, className }) => {
  return (
    <div className={classNames('flex items-center p-6 pt-0', className)}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardBody, CardFooter };
