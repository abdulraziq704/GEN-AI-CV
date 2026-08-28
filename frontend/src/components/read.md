//
export const protected=({children})=>{

    const {user,loading}=useAuth();

    if(loading) return (<h1>loading...</h1>)

    if(!user) return (
        <Navigate to="/login" replace/>
     );

    return children;

}