export const goToBarPage = (bar_id) => {
  return {
    type: 'GOTO_BAR',
    id: bar_id
  }
}