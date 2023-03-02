try {
  const selection = figma.currentPage.selection;
  const orderedSelection = figma.currentPage.findAll((node) =>
    selection.includes(node)
  );
  if (orderedSelection.length < 1) {
    throw new Error("Nothing selected!");
  }

  const [base, ...rest] = orderedSelection;

  if (base.type === "FRAME") {
    const bAbsX = base.absoluteTransform[0][2];
    const bAbsY = base.absoluteTransform[1][2];
    for (const node of rest) {
      const absX = node.absoluteTransform[0][2];
      const absY = node.absoluteTransform[1][2];
      base.appendChild(node);
      if ("layoutPositioning" in node) {
        if (base.layoutMode !== "NONE") {
          node.layoutPositioning = "ABSOLUTE";
          node.x = absX - bAbsX;
          node.y = absY - bAbsY;
        }
      }
    }
  } else {
    throw new Error("Reparent target is not a frame!");
  }
  // figma.viewport.scrollAndZoomIntoView(selection);
} catch (e) {
  figma.notify((e as Error).message);
}

figma.closePlugin();
