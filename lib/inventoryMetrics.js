export const calculateInventory = (productionLogs) => {
  let totalMixes = 0

  productionLogs.forEach((log) => {
    totalMixes += log.mixes
  })

  const crates = totalMixes * 2
  const cakes = crates * 24
  const flourUsed = totalMixes * 2

  return {
    mixes: totalMixes,
    crates,
    cakes,
    flourUsed
  }
}