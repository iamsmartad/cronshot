import {CodeBlock, monoBlue} from "react-code-blocks";
import YAML from "yaml";

type Props = {
  yamlobj: any;
};

export const YAMLCodeBlock = ({yamlobj}: Props) => {
  return (
    <CodeBlock
      text={YAML.stringify(yamlobj)}
      language="yaml"
      showLineNumbers={false}
      theme={monoBlue}
    />
  );
};
