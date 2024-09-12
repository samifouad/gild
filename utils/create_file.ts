

export async function create_file(path: string, name: string, type: string) {
    try {
        switch (type) {
            case 'toml':
                const toml_file = Bun.file("./"+ path +"/"+ name, { type: "application/toml" });
                await Bun.write(toml_file, "");
                return { exitCode: 0 }
                
            case 'json':
                const json_file = Bun.file("./"+ path +"/"+ name, { type: "application/json" });
                await Bun.write(json_file, "");
                return { exitCode: 0 }
                
            default:
                throw new Error('unsupported file type')
        }
    } catch(e: any) {
        throw new Error(e)
    }
}