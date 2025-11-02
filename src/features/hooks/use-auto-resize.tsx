import { useCallback, useEffect } from "react"
import { FabricNS } from "@/lib/fabric-loader"
export const useAutoResize = ({
  containerDom,
  fabricCanvas,
  workspace,
}: {
  containerDom: HTMLDivElement | null
  fabricCanvas: FabricNS.Canvas | null
  workspace: FabricNS.Rect | null
}) => {
  const autoZoom = useCallback(() => {
    if (!containerDom || !fabricCanvas || !workspace) return

    const width = containerDom.offsetWidth
    const height = containerDom.offsetHeight

    fabricCanvas.setWidth(width)
    fabricCanvas.setHeight(height)

    const scale = Math.min(width / workspace.width!, height / workspace.height!)

    const workspaceCenter = workspace.getCenterPoint()

    const translateX = width / 2 - workspaceCenter.x * scale
    const translateY = height / 2 - workspaceCenter.y * scale

    const transform = [scale, 0, 0, scale, translateX, translateY]

    fabricCanvas.setViewportTransform(transform)
  }, [containerDom, fabricCanvas, workspace])

  useEffect(() => {
    if (!containerDom) return
    const resizeObserver = new ResizeObserver(() => {
      autoZoom()
    })
    resizeObserver.observe(containerDom)
    return () => {
      resizeObserver?.disconnect()
    }
  }, [containerDom, autoZoom])
}
