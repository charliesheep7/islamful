interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <span className="text-accent-600 mr-3 text-sm font-medium uppercase">
      {text.split(' ').join('-')}
    </span>
  )
}

export default Tag
