export const hasReceiptFile = (file: any) => {
  return Boolean(file?.path && file?.mimetype);
};
