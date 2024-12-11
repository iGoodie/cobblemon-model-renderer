import { expressions, IExpression, Molang } from "molang";

export class MolangExpression {
  static molang = new Molang({}, { useCache: false });

  private ast: IExpression;
  private animTimeNodes: expressions.NumberExpression[] = [];

  constructor(script: string) {
    this.ast = MolangExpression.molang.parse(script);

    this.ast.walk((node) => {
      if (node instanceof expressions.NameExpression) {
        if (node["name"] === "q.anim_time") {
          const animTimeNode = new expressions.NumberExpression(0);
          this.animTimeNodes.push(animTimeNode);
          return animTimeNode;
        }
      }
      return node;
    });
  }

  public eval(animTime: number) {
    this.animTimeNodes.forEach((node) => (node["value"] = animTime));
    return this.ast.eval();
  }
}
