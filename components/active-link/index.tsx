import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const ActiveLink = ({
  children,
  activeClassName,
  ...props
}: LinkProps & { activeClassName: string; children: React.ReactElement }) => {
  const { asPath } = useRouter();
  const child = React.Children.only(children);
  const childClassName = child.props.className || '';

  const className =
    asPath === props.href || asPath === props.as ? `${childClassName} ${activeClassName}`.trim() : childClassName;

  return (
    <Link {...props}>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  );
};

export default ActiveLink;
