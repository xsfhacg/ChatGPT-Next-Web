// 顶部导航菜单
import React from "react";
import { NavLink } from "react-router-dom";
import "./top-navigation.scss";

interface TopNavigationProps {
  links: Array<{
    to: string | { pathname: string; isExternal: boolean };
    label: string;
  }>;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ links }) => {
  return (
    <nav className="top-navigation">
      <ul className="top-navigation-list">
        {links.map((link, index) => (
          <li key={index} className="top-navigation-list-item">
            {typeof link.to === "object" && link.to.isExternal ? (
              <a
                href={link.to.pathname}
                className="top-navigation-link"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                to={typeof link.to === "object" ? link.to.pathname : link.to}
                className={({ isActive }) =>
                  `top-navigation-link${
                    isActive ? " top-navigation-link-active" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TopNavigation;
