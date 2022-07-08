export const selectOneForCurrentUser = (userId?: string) => {
  return {
    take: userId ? 1 : 0,
    where: { userId },
    select: { id: true },
  };
};
