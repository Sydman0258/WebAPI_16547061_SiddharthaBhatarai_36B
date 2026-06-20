export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section>
            Server Layout Head
            {children}
            Server Layout Tail
        </section>
    );
}