
export default function EventPage({ params }: { params: { id: string } }) {
    return <h1>Event ID: {params.id}</h1>;
}