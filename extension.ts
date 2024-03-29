import * as vscode from 'vscode';

// Define a configuration object with word definitions
const optionDefinitions: { [word: string]: string } = {
    opt: 'This is a description for "opt".\n - server_output \n - client_output \n - casing \n - write_checks \n - typescript \n - manual_event_loop \n - yield_type \n - async_lib',
    casing: 'This option changes the casing of the API generated by Zap. \n - PascalCase \n - camelCase \n - snake_case',
    write_checks: 'This option determines if Zap should check types when writing data to the network.\n This is useful for development and debugging, but can see some performance hits, and should be disabled in production.\n - true \n - false',
    typescript: 'This option determines if Zap should generate TypeScript definition files alongside generated Luau code. \n -true \n - false',
    manual_event_loop: 'This option determines if Zap automatically sends reliable events and functions each Heartbeat.',
    yield_type: 'This option changes the way functions yield in zap.\n - yield \n - future \n - promise',
    async_lib: 'This option provides the async library to Zap. \nThe option must include a require statement, as it will be fed directly into the Luau code.\n - opt async_lib = "require(game:GetService("ReplicatedStorage").Promise)"',
    server_output: 'The paths are relative to the configuration file and should point to a lua(u) file.',
    client_output: 'The paths are relative to the configuration file and should point to a lua(u) file.',
};

const typeDefinitions: { [word: string]: string } = {
    ["0..100"]: 'This is a description for "range" 0..100.\n - min 0 \n - max 100',
    ["0.."]: 'This is a description for "range" 0..any number.\n - min 0',
    [".."]: 'This is a description for "range" any number..any number',
    i8: 'This is a description for signed integer. \n - min -128 \n - max 127',
    i16: 'This is a description for signed integer. \n - min -32768 \n - max 32767',
    i32: 'This is a description for signed integer. \n - min -2147483648 \n - max 2147483647',
    u8: 'This is a description for unsigned integer. \n - min 0 \n - max 255',
    u16: 'This is a description for unsigned integer. \n - min 0 \n - max 65535',
    u32: 'This is a description for unsigned integer. \n - min 0 \n - max 4294967295',
    f32: 'This is a description for float. \n - min -2147483648 \n - max 2147483647',
    f64: 'This is a description for float. \n - min -9223372036854775808 \n - max 9223372036854775807',
    string: 'This is a description for string.',
    arrays: 'u8[], i16[], string[]',
    map: 'map { [string]: u8 }',
    enum: 'enum { Starting, Playing, Intermission }\n enum "Type" { Number{Value: f64}, String{Value: string}, Boolean{Value: boolean}}',
    struct: 'Structs are similar to Interfaces, and are a collection of statically named fields with different types. \n type Item = struct {name: string, price: u16}',
    Instance: 'Roblox Instances \n type Part = Instance (BasePart)',
    CFrame: 'Roblox CFrame \n type CFrame = Instance (CFrame)',
    AlignedCFrame: 'Roblox CFrame \n When you know that a CFrame is going to be axis-aligned, it is preferrable to use the AlignedCFrame type.',
    Vector3: 'Roblox Vector3 \n type Vector3',
};

const eventDefinitions: { [word: string]: string } = {
    event: 'Events are the primary method of communication between the client and the server.\n Events are also what is exposed to the developer from Zaps generated API. \n - from \n - type \n - call \n - data',
    from: 'This field determines which side of the game can fire the event. \n - Server \n - Client',
    type: 'This field determines the type of event. \n - Reliable \n - Unreliable',
    call: 'This field determines how the event is listened to on the receiving side.\n - ManyAsync \n - ManySync \n - SingleAsync \n - SingleSync',
    data: 'This field determines the data that is sent with the event. It can be any Zap type.'
};

const functDefinitions: { [word: string]: string } = {
    funct: 'Functions are another method of communication where the client can send arguments and have them returned by the server. \nFor security, Zap only supports Client -> Server -> Client functions, \nnot Server -> Client -> Server.\n - call \n - rets \n - args',
    call: 'This field determines how the function is listened to on the server.\nThe function will take the args as parameters and return rets. \n - Async functions can be listened to by one function, and they are called asynchronously. \n - Sync functions can be listened to by one function, and they are called synchronously.',
    args: 'This field determines the data that is sent to the server. It can be any Zap type.',
    rets: 'This field determines the data that is sent back to the client from the server. It can be any Zap type.'
};

export function activate(context: vscode.ExtensionContext) {
    console.log('Zap extension active!')

    // Completion provider for 'opt' section
    const optCompletionProvider = vscode.languages.registerCompletionItemProvider('zap', {
        provideCompletionItems(document, position) {
            const line = document.lineAt(position);
            const linePrefix = line.text.substring(0, position.character);

            if (!linePrefix.match(/\b(?:o|op|opt|opt\xa0)$/)) {
                return undefined;
            }

            // Create completion items for 'opt' followed by words
            const completionItems = Object.keys(optionDefinitions)
                .map((word) => {
                    const item = new vscode.CompletionItem(`opt ${word}`, vscode.CompletionItemKind.Text);
                    item.insertText = new vscode.SnippetString(`opt ${word} = $0`);
                    item.documentation = new vscode.MarkdownString(optionDefinitions[word]);
                    return item;
                });

            return completionItems;
        }
    });

    // Completion provider for 'type' section
    const typeCompletionProvider = vscode.languages.registerCompletionItemProvider('zap', {
        provideCompletionItems(document, position) {
            const line = document.lineAt(position);
            const linePrefix = line.text.substring(0, position.character);

            if (!linePrefix.match(/\b(?:t|ty|typ|type|type\xa0)$/)) {
                return undefined;
            }

            // Create completion items for 'type' followed by words
            const completionItems = Object.keys(typeDefinitions)
                .map((word) => {
                    const item = new vscode.CompletionItem(`type ${word}`, vscode.CompletionItemKind.Text);
                    item.insertText = new vscode.SnippetString(`${word}$0`);
                    item.documentation = new vscode.MarkdownString(typeDefinitions[word]);
                    return item;
                });

            return completionItems;
        }
    });

    // Completion provider for 'event' section
    const eventCompletionProvider = vscode.languages.registerCompletionItemProvider('zap', {
        provideCompletionItems(document, position) {
            const line = document.lineAt(position);
            const linePrefix = line.text.substring(0, position.character);

            if (!linePrefix.match(/\b(?:e|ev|eve|even|event|event\xa0)$/)) {
                return undefined;
            }

            // Create completion items for 'event' followed by words
            const completionItems = Object.keys(eventDefinitions)
                .map((word) => {
                    const item = new vscode.CompletionItem(`event ${word}`, vscode.CompletionItemKind.Text);
                    if (word !== 'event') {
                        item.insertText = new vscode.SnippetString(`${word}: $0`);
                    } else {
                        item.insertText = new vscode.SnippetString(`${word} $0`);
                    }
                    item.documentation = new vscode.MarkdownString(eventDefinitions[word]);
                    return item;
                });

            return completionItems;
        }
    });

    // Completion provider for 'funct' section
    const functCompletionProvider = vscode.languages.registerCompletionItemProvider('zap', {
        provideCompletionItems(document, position) {
            const line = document.lineAt(position);
            const linePrefix = line.text.substring(0, position.character);

            if (!linePrefix.match(/\b(?:f|fu|fun|func|funct|funct\xa0)$/)) {
                return undefined;
            }

            // Create completion items for 'funct' followed by words
            const completionItems = Object.keys(functDefinitions)
                .map((word) => {
                    const item = new vscode.CompletionItem(`funct ${word}`, vscode.CompletionItemKind.Text);
                    if (word !== 'funct') {
                        item.insertText = new vscode.SnippetString(`${word}: $0`);
                    } else {
                        item.insertText = new vscode.SnippetString(`${word} $0`);
                    }
                    item.documentation = new vscode.MarkdownString(functDefinitions[word]);
                    return item;
                });

            return completionItems;
        }
    });

    // Common completion provider for all lists
    const commonCompletionProvider = vscode.languages.registerCompletionItemProvider('zap', {
        provideCompletionItems(document, position) {
            const line = document.lineAt(position);
            const linePrefix = line.text.substring(0, position.character);

            // Check if the line starts with any of the list keys
            const listKeys = [
                'opt', // Add other list keys here
                'type',
                'event',
                'funct'
            ];

            for (const key of listKeys) {
                if (linePrefix.match(new RegExp(`\\b${key}(\\s+)`))) {
                    let wordList: { [word: string]: string } = {};

                    // Determine which word list to use based on the key
                    switch (key) {
                        case 'opt':
                            wordList = optionDefinitions;
                            break;
                        case 'type':
                            wordList = typeDefinitions;
                            break;
                        case 'event':
                            wordList = eventDefinitions;
                            break;
                        case 'funct':
                            wordList = functDefinitions;
                            break;
                        // Add cases for other list keys here
                    }

                    // Create completion items for words in the selected list
                    const completionItems = Object.keys(wordList)
                        .map((word) => {
                            const item = new vscode.CompletionItem(word, vscode.CompletionItemKind.Text);
                            item.documentation = new vscode.MarkdownString(wordList[word]);
                            return item;
                        });

                    return completionItems;
                }
            }

            return undefined;
        }
    });

    // Common hover provider for all lists
    const commonHoverProvider = vscode.languages.registerHoverProvider('zap', {
        provideHover(document, position, token) {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return undefined;
            }
            const word = document.getText(wordRange);

            // Check if the word is in any of the dictionaries
            if (optionDefinitions[word]) {
                return new vscode.Hover(new vscode.MarkdownString(optionDefinitions[word]));
            } else if (typeDefinitions[word]) {
                return new vscode.Hover(new vscode.MarkdownString(typeDefinitions[word]));
            } else if (eventDefinitions[word]) {
                return new vscode.Hover(new vscode.MarkdownString(eventDefinitions[word]));
            } else if (functDefinitions[word]) {
                return new vscode.Hover(new vscode.MarkdownString(functDefinitions[word]));
            }

            return undefined;
        }
    });

    context.subscriptions.push(optCompletionProvider, typeCompletionProvider, eventCompletionProvider, functCompletionProvider, commonCompletionProvider, commonHoverProvider);
}

export function deactivate() { }
