
import Body from './Body';


interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({params}:ProfilePageProps) {
  const data = await params

  return (
    <Body params={data}/>
  );
}