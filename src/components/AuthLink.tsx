import React from 'react';
import Link from 'next/link';

interface AuthLinkProps {
  text: string;
  linkText: string;
  href: string;
}

const AuthLink: React.FC<AuthLinkProps> = ({ text, linkText, href }) => {
  return (
    <p className="mt-4 text-left text-sm">
      {text}{" "}
      <Link href={href} legacyBehavior>
        <a className="text-blue-500 hover:underline">{linkText}</a>
      </Link>
    </p>
  );
};

export default AuthLink;
