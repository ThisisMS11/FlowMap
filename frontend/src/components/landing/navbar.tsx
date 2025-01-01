export default function Navbar() {
    return (
        <>
            <main className="max-w-6xl mt-3 mx-auto">
                <div className="p-4 ">
                    <div className="flex bg-accent/50 backdrop-blur-2xl items-center justify-between p-3 rounded-xl">
                        {/* <Logo /> */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 text-sm">
                                <span>Products</span>
                                <span>Help</span>
                                <span>Docs</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
