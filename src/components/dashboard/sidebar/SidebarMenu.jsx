import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore, FiberManualRecord as DotIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { usePermissions } from "@/hooks/usePermissions";

export default function SidebarMenu({ sections, pathname, variant, onClose }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { isModuleEnabled, checkPermission } = usePermissions();

  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    const newOpen = {};
    sections.forEach((it) => {
      if (it.expandable && it.children) {
        const match = it.children.some(
          (ch) => pathname === ch.path || pathname.startsWith(ch.path)
        );
        if (match) newOpen[it.label] = true;
      }
    });

    setOpenMenus((prev) => ({ ...prev, ...newOpen }));
  }, [pathname, sections]);

  const toggleSubMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const normalizePath = (url = "") => url.split("?")[0];

  const isActivePath = (path) => {
    if (!path) return false;

    const current = normalizePath(pathname);
    const target = normalizePath(path);

    if (target === "/dashboard") return current === "/dashboard";

    return current === target || current.startsWith(target + "/");
  };


  const handleNavClick = (isExpandableParent = false) => {
    if (variant === "temporary" && !isExpandableParent) {
      onClose?.();
    }
  };

  const handleChildClick = () => {
    if (variant === "temporary") onClose?.();
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        mt: 1,
        pb: 1,
      }}
      className=""
    >
      <List disablePadding>
        {sections.map(({ label, path, icon, expandable, permissions, module, children }) => {
          // console.log("Module: ",module);
          if(!module || !isModuleEnabled(module)) return false;
          if(permissions && !checkPermission(permissions)) return false;
          if (expandable) {
            const childActive = children?.some((c) => isActivePath(c.path));


            return (
              <Box key={label}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => toggleSubMenu(label)}
                    selected={!!openMenus[label] || childActive}
                    sx={{
                      borderRadius: 1,
                      mx: 0.5,
                      my: 0.3,
                      gap: 1,
                      py: 0.6,          // 🔥 reduce vertical padding
                      minHeight: 36,
                      "&.Mui-selected": {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.12)"
                          : "rgba(0,0,0,0.06)",
                        color: "inherit",
                      },

                      "&:hover": {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    {icon && (
                      <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                        {React.cloneElement(icon, { fontSize: "small" })}
                      </ListItemIcon>
                    )}

                    <ListItemText primary={label} />
                    {openMenus[label] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>

                <Collapse in={!!openMenus[label] || childActive} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {children.map((child) => {
                      const selected = isActivePath(child.path);
            
                      if(!child?.module || !isModuleEnabled(child?.module)) return false;
          if(child?.permissions && !checkPermission(child?.permissions)) return false;
            
                      return (
                        <ListItem key={child.label} disablePadding>
                          <ListItemButton
                            component={Link}
                            href={child.path}
                            selected={selected}
                            onClick={handleChildClick}
                            sx={{
                              pl: 4.5,
                              borderRadius: 1,
                              mx: 0.5,
                              my: 0.2,
                              gap: 1,
                              py: 0.45,         // 🔥 smaller than parent
                              minHeight: 32,
                              "&.Mui-selected": {
                                backgroundColor: isDark
                                  ? "rgba(255,255,255,0.14)"
                                  : "rgba(0,0,0,0.10)",
                                color: "inherit",
                              },

                              "&:hover": {
                                backgroundColor: isDark
                                  ? "rgba(255,255,255,0.08)"
                                  : "rgba(0,0,0,0.04)",
                              },
                            }}
                          >
                            <ListItemIcon sx={{ color: "text.primary", minWidth: 22 }}>
                              {React.cloneElement(child.icon || <DotIcon />, {
                                fontSize: "small",
                              })}
                            </ListItemIcon>

                            <ListItemText
                              primary={child.label}
                              sx={{
                                maxWidth: 180,              // apni width ke hisaab se adjust
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                "&:hover": {
                                  whiteSpace: "normal",
                                  overflow: "visible",
                                },
                              }}
                            />

                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          }

          const selected = isActivePath(path);

          return (
            <ListItem key={label} disablePadding>
              <ListItemButton
                component={Link}
                href={path}
                selected={selected}
                onClick={() => handleNavClick(false)}
                sx={{
                  borderRadius: 1,
                  mx: 0.5,
                  my: 0.2,
                  gap: 1,
                  py: 0.6,          // 🔥 reduce vertical padding
                  minHeight: 36,
                  "&.Mui-selected": {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(0,0,0,0.06)",
                    color: "inherit",
                  },

                  "&:hover": {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.04)",
                  },
                }}
              >
                {icon && (
                  <ListItemIcon sx={{ color: "inherit", minWidth: 18 }}>
                    {React.cloneElement(icon, { fontSize: "small" })}
                  </ListItemIcon>
                )}

                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
