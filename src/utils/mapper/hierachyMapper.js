// utils/hierarchyMapper.js

/**
 * Convert frontend nested seating tree
 * → backend flat hierarchy payload
 */
// export function frontendToBackendHierarchy(seating, venueId) {
//   const result = [];

//   function walk(nodes, parentId = null) {
//     nodes.forEach((node) => {
//       const tempId = crypto.randomUUID();

//       result.push({
//         temp_id: tempId,
//         venue_id: venueId,
//         parent_id: parentId,
//         name: node.name,
//         seats_count: node.seats || 0,
//         type: "seating",
//       });

//       if (node.children?.length) {
//         walk(node.children, tempId);
//       }
//     });
//   }

//   walk(seating);
//   return result;
// }

/**
 * Convert backend hierarchy
 * → frontend nested structure
 */
export function backendToFrontendHierarchy(flat) {
  const map = {};
  const roots = [];

  flat.forEach((n) => {
    map[n.id] = {
      id: n.id,
      name: n.name,
      seats: n.seats_count,
      children: [],
    };
  });

  flat.forEach((n) => {
    if (n.parent_id) {
      map[n.parent_id]?.children.push(map[n.id]);
    } else {
      roots.push(map[n.id]);
    }
  });

  return roots;
}
