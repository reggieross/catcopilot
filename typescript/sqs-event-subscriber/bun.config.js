await Bun.build({
    entrypoints: [
        './handlers/sqs/eventA.ts',
        './handlers/sqs/eventB.ts',
        './handlers/sqs/eventC.ts',
    ],
    outdir: './build',
    root: '.',
    target: 'bun'
});