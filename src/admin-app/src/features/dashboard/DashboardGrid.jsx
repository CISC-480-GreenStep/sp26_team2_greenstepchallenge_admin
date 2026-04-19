import { useContainerWidth, ResponsiveGridLayout, verticalCompactor } from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { GlobalStyles, Box } from "@mui/material";

import { WIDGET_MAP } from "./dashboardConfig";
import DashboardWidget from "./DashboardWidget";

export default function DashboardGrid({
  visible,
  layouts,
  isEditing,
  onLayoutChange,
  onRemoveWidget,
  renderWidget,
}) {
  const { width, containerRef, mounted } = useContainerWidth({ initialWidth: 1200 });

  return (
    <Box ref={containerRef} sx={{ minHeight: 200 }}>
      {mounted && (
        <>
          <GlobalStyles
            styles={{
              ".react-grid-item > .react-resizable-handle::after": {
                borderColor: "rgba(0,0,0,0.25) !important",
              },
              ".react-grid-item.react-grid-placeholder": {
                background: "rgba(46,125,50,0.15) !important",
                borderRadius: "8px",
              },
            }}
          />
          <ResponsiveGridLayout
            width={width}
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={50}
            margin={{
              lg: [16, 16],
              md: [14, 14],
              sm: [12, 12],
              xs: [10, 10],
              xxs: [8, 8],
            }}
            containerPadding={{
              lg: [0, 0],
              md: [0, 0],
              sm: [0, 0],
              xs: [0, 0],
              xxs: [0, 0],
            }}
            dragConfig={{ enabled: isEditing, handle: ".drag-handle" }}
            resizeConfig={{ enabled: isEditing }}
            compactor={verticalCompactor}
            onLayoutChange={onLayoutChange}
            autoSize
          >
            {visible.map((id) => {
              const widget = WIDGET_MAP[id];
              if (!widget) return null;
              return (
                <div key={id}>
                  <DashboardWidget
                    title={widget.title}
                    isEditing={isEditing}
                    onRemove={() => onRemoveWidget(id)}
                  >
                    {renderWidget(id)}
                  </DashboardWidget>
                </div>
              );
            })}
          </ResponsiveGridLayout>
        </>
      )}
    </Box>
  );
}
