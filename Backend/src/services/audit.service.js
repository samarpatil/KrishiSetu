const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  user,
  action,
  resource,
  resourceId,
  details,
  ipAddress,
}) => {
  return AuditLog.create({
    user,
    action,
    resource,
    resourceId,
    details,
    ipAddress,
  });
};

module.exports = {
  createAuditLog,
};
