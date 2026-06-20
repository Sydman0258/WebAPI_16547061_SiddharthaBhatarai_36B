export default function Template({children}: { children: React.ReactNode }) {
    return (
        <div>
            Template Head
            {children}
            Template Tail
        </div>
    );
}