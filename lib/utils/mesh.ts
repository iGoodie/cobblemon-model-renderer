export function buildBoneTree<I extends PropertyKey, B extends object>(
  bones: B[],
  selfIdGetter: (bone: B) => I,
  parentIdGetter: (bone: B) => I | undefined
) {
  type BoneTree = B & { children: BoneTree[] };

  const boneLookup = {} as Record<I, BoneTree>;
  const boneTree: BoneTree[] = [];

  for (const node of bones) {
    const tree = { ...node, children: [] } as BoneTree;
    boneLookup[selfIdGetter(node)] = tree;
  }

  for (const bone of Object.values<BoneTree>(boneLookup)) {
    const parentId = parentIdGetter(bone);
    if (parentId != null) {
      boneLookup[parentId].children.push(bone);
    } else {
      boneTree.push(bone);
    }
  }

  return boneTree;
}
