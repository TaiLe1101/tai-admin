import { App, ConfigProvider, theme } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import { APP_THEME } from "#/shared/constants/theme";
import { GlobalModalDrawerConfirmHandler } from "./GlobalModalDrawerConfirmHandler";

// Kích hoạt locale Tiếng Việt cho dayjs
dayjs.locale("vi");

type Props = React.PropsWithChildren;

export function ThemeProvider({ children }: Props) {
  return (
    <ConfigProvider
      locale={viVN}
      modal={{
        mask: { closable: false },
      }}
      drawer={{
        mask: { closable: false },
      }}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          // colorPrimary: APP_THEME.colorPrimary,
          borderRadius: APP_THEME.borderRadius,
          fontFamily: APP_THEME.fontFamily,
          colorBorder: APP_THEME.colorBorder,
          colorBorderSecondary: APP_THEME.colorBorderSecondary,
          colorSplit: APP_THEME.colorSplit,
        },
        components: {
          Table: {
            headerBg: APP_THEME.tableHeaderBgColor,
            borderColor: APP_THEME.colorBorderSecondary,
            borderRadius: APP_THEME.tableBorderRadius,
            borderRadiusOuter: APP_THEME.tableBorderRadius,
            borderRadiusLG: APP_THEME.tableBorderRadius,
            borderRadiusSM: APP_THEME.tableBorderRadius,
            borderRadiusXS: APP_THEME.tableBorderRadius,
            headerBorderRadius: APP_THEME.tableBorderRadius,
            stickyScrollBarBorderRadius: APP_THEME.tableBorderRadius,
          },
        },
      }}
    >
      <App>
        <GlobalModalDrawerConfirmHandler />
        {children}
      </App>
    </ConfigProvider>
  );
}
