import { Box, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";

const roles = [
  { value: "ALL", label: "All", icon: "/assets/img/lanes/fill.png" },
  { value: "TOP", label: "Top", icon: "/assets/img/lanes/top.png" },
  { value: "JUNGLE", label: "Jungle", icon: "/assets/img/lanes/jungle.png" },
  { value: "MIDDLE", label: "Mid", icon: "/assets/img/lanes/middle.png" },
  { value: "BOTTOM", label: "ADC", icon: "/assets/img/lanes/bottom.png" },
  { value: "UTILITY", label: "Support", icon: "/assets/img/lanes/support.png" },
];

export { roles };

const RoleFilter = ({ selectedRole, onRoleChange, showLabels = false }) => {
  return (
    <ToggleButtonGroup
      value={selectedRole}
      exclusive
      onChange={(e, newRole) => {
        if (newRole !== null) {
          onRoleChange(newRole);
        }
      }}
      sx={{
        bgcolor: "#2a2a2a",
        borderRadius: 1,
        "& .MuiToggleButton-root": {
          color: "#888",
          border: "none",
          px: showLabels ? 2 : 1.5,
          py: showLabels ? 1 : 0.5,
          "&:hover": {
            bgcolor: "#3a3a3a",
          },
          "&.Mui-selected": {
            bgcolor: "#3a3a3a",
            color: "primary.main",
            "&:hover": {
              bgcolor: "#4a4a4a",
            },
          },
        },
      }}
    >
      {roles.map((role) => (
        <ToggleButton key={role.value} value={role.value}>
          {showLabels ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Box
                component="img"
                src={role.icon}
                alt={role.label}
                loading="lazy"
                sx={{ width: 24, height: 24 }}
              />
              <Typography sx={{ fontSize: 10, textTransform: "none" }}>
                {role.label}
              </Typography>
            </Box>
          ) : (
            <Box
              component="img"
              src={role.icon}
              alt={role.label}
              loading="lazy"
              sx={{ width: 20, height: 20 }}
            />
          )}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default RoleFilter;
