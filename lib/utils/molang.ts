import { expressions, IExpression, Molang } from "molang";

export class MolangExpression {
  static molang = new Molang({}, { useCache: false });

  private ast: IExpression;
  private animTimeNodes: expressions.NumberExpression[] = [];

  constructor(script: string, molang?: Molang) {
    this.ast = (molang ?? MolangExpression.molang).parse(script);

    this.animTimeNodes = this.replaceNodes(
      (node): node is expressions.NameExpression =>
        node instanceof expressions.NameExpression &&
        node["name"] === "q.anim_time",
      () => new expressions.NumberExpression(0)
    );
  }

  public replaceNodes<N extends IExpression, R extends IExpression>(
    predicate: (node: IExpression) => node is N,
    replacement: (node: N) => R
  ) {
    const replacementNodes: R[] = [];

    this.ast.walk((node) => {
      if (predicate(node)) {
        const replacementNode = replacement(node as N);
        replacementNodes.push(replacementNode);
        return replacementNode;
      }

      return node;
    });

    return replacementNodes;
  }

  public updateAnimTime(animTime: number) {
    this.animTimeNodes.forEach((node) => (node["value"] = animTime));
    return this;
  }

  public eval() {
    return this.ast.eval();
  }
}
