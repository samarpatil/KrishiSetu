import { notifications } from "../data/notifications";
import { withMock, request } from "./api";
export const getNotifications = () =>
  withMock(
    () => notifications,
    () => request("/notifications"),
    200,
  );
