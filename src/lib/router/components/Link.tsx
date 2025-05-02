import { PropsWithChildren } from "react";
import { LinkProps } from "../types";
import { constructFullPath } from "../utils";
import { useRouter } from "../hooks";

export const Link: React.FC<PropsWithChildren<LinkProps>> = ({
  href,
  children,
  className,
  onClick,
  target,
  ...props
}) => {
  const { navigate } = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(event);

    if (
      event.defaultPrevented ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.shiftKey ||
      event.button !== 0 ||
      target
    ) {
      return;
    }

    event.preventDefault();
    navigate(href);
  };

  const fullHref = constructFullPath(href);

  return (
    <a
      href={fullHref}
      onClick={handleClick}
      className={className}
      target={target}
      {...props}
    >
      {children}
    </a>
  );
};
