const selectedOrder: number[] = [];

export function getSelectedOrder() {
  return [...selectedOrder];
}

export function setSelected(id: number, selected: boolean) {
  if (selected) {
    if (!selectedOrder.includes(id)) {
      selectedOrder.push(id);
    }
    return;
  }

  const index = selectedOrder.indexOf(id);

  if (index !== -1) {
    selectedOrder.splice(index, 1);
  }
}

export function reorderSelected(ids: number[]) {
  const selectedSet = new Set(selectedOrder);
  const nextOrder = ids.filter((id) => selectedSet.has(id));
  const remaining = selectedOrder.filter((id) => !nextOrder.includes(id));

  selectedOrder.length = 0;
  selectedOrder.push(...nextOrder, ...remaining);
}
