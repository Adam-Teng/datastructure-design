/* eslint-disable no-cond-assign */
/* eslint-disable no-prototype-builtins */
/* eslint-disable complexity */
/* eslint-disable max-params */
import { bus } from '~/bus'
import type { edgeMap, mapPoint, neighbor, pointMap } from '~/typings/map'

/**
 * @param {edgeMap} myEdgeMap - edge map
 * @param {pointMap} myPointMap - point map
 * @param {mapPoint} startPoint - start point
 * @param {mapPoint} endPoint - end point
 * @param {number} timeOrDis - distance: 0, time:1
 * @param {number} bike - is bike?
 * @return [cost, points list, paths list]
 */
export function dijkstra(
  myEdgeMap: edgeMap,
  myPointMap: pointMap,
  startPoint: mapPoint,
  endPoint: mapPoint,
  /** distance: 0, time:1 */
  timeOrDis: number,
  bike: number,
): [Record<string, number>, Record<string, string[]>, Record<string, string[]>, Record<string, number>] {
  /** 从key点到起始点的距离 */
  const distance: Record<string, number> = {}
  const rawDistance: Record<string, number> = {}
  const used: Record<string, boolean> = {}
  const prev: Record<string, null | { point: mapPoint; edge: string }> = {}
  for (const point in myPointMap) {
    if (myPointMap.hasOwnProperty(point)) {
      distance[myPointMap[point].id] = -1
      rawDistance[myPointMap[point].id] = -1
      used[myPointMap[point].id] = false
    }
  }
  distance[startPoint.id] = 0
  rawDistance[startPoint.id] = 0
  used[startPoint.id] = true
  prev[startPoint.id] = null
  const tempNeighbor: neighbor[] = JSON.parse(JSON.stringify(startPoint.neighborWalk))
  if (bike) {
    for (const bikeItem of startPoint.neighborBike) {
      for (const walkItem of tempNeighbor) {
        if (walkItem.toPointId === bikeItem.toPointId) {
          walkItem.edgeId = bikeItem.edgeId
          break
        }
      }
    }
  }
  for (const next of tempNeighbor) {
    if (timeOrDis && myEdgeMap[next.edgeId].type === 2) {
      distance[next.toPointId]
                = distance[startPoint.id]
                + ((myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis))
                    / bus.speed.bike)
                    * bus.speed.walk
    }
    else {
      distance[next.toPointId]
                = distance[startPoint.id]
                + myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
    }
    rawDistance[next.toPointId] = rawDistance[startPoint.id] + myEdgeMap[next.edgeId].length
    prev[next.toPointId] = {
      point: startPoint,
      edge: next.edgeId,
    }
  }
  for (let i = 1; i < Object.keys(myPointMap).length; i++) {
    let minNum = ''
    let min = Infinity
    for (const j in distance) {
      if (distance[j] !== -1 && distance[j] < min && !used[j]) {
        minNum = j
        min = distance[j]
      }
    }
    used[minNum] = true
    const tempNeighbor2: neighbor[] = JSON.parse(JSON.stringify(myPointMap[minNum].neighborWalk))
    if (bike) {
      for (const bikeItem of myPointMap[minNum].neighborBike) {
        for (const walkItem of tempNeighbor2) {
          if (walkItem.toPointId === bikeItem.toPointId) {
            walkItem.edgeId = bikeItem.edgeId
            break
          }
        }
      }
    }
    for (const next of tempNeighbor2) {
      if (distance[next.toPointId] === -1) {
        if (timeOrDis && myEdgeMap[next.edgeId].type === 2) {
          distance[next.toPointId]
                        = distance[minNum]
                        + ((myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis))
                            / bus.speed.bike)
                            * bus.speed.walk
        }
        else {
          distance[next.toPointId]
                        = distance[minNum]
                        + myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
        }
        rawDistance[next.toPointId] = rawDistance[minNum] + myEdgeMap[next.edgeId].length
        prev[next.toPointId] = {
          point: myPointMap[minNum],
          edge: next.edgeId,
        }
      }
      else if (
        timeOrDis
                && myEdgeMap[next.edgeId].type === 2
                && distance[next.toPointId]
                    > distance[minNum]
                        + myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
      ) {
        if (timeOrDis && myEdgeMap[next.edgeId].type === 2) {
          distance[next.toPointId]
                        = distance[minNum]
                        + ((myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis))
                            / bus.speed.bike)
                            * bus.speed.walk
        }
        else {
          distance[next.toPointId]
                        = distance[minNum]
                        + myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
        }
        rawDistance[next.toPointId] = rawDistance[minNum] + myEdgeMap[next.edgeId].length
        prev[next.toPointId] = {
          point: myPointMap[minNum],
          edge: next.edgeId,
        }
      }
      else if (
        distance[next.toPointId]
                > distance[minNum]
                    + myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
      ) {
        if (timeOrDis && myEdgeMap[next.edgeId].type === 2) {
          distance[next.toPointId]
                        = distance[minNum]
                        + ((myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis))
                            / bus.speed.bike)
                            * bus.speed.walk
        }
        else {
          distance[next.toPointId]
                        = distance[minNum]
                        + myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
        }
        rawDistance[next.toPointId] = rawDistance[minNum] + myEdgeMap[next.edgeId].length
        prev[next.toPointId] = {
          point: myPointMap[minNum],
          edge: next.edgeId,
        }
      }
    }
  }
  const points: Record<string, string[]> = {}
  const path: Record<string, string[]> = {}
  for (const idCur in distance) {
    if (distance.hasOwnProperty(idCur)) {
      let current = idCur
      points[idCur] = []
      path[idCur] = []
      let e
      while ((e = prev[current]) !== null) {
        points[idCur].splice(0, 0, current)
        path[idCur].splice(0, 0, e.edge ? e.edge : '')
        current = e.point.id
      }
      points[idCur].splice(0, 0, current)
    }
  }
  return [distance, points, path, rawDistance]
}
