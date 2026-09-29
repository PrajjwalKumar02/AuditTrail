# Aggregate Development Notes

## Purpose

The aggregate module reconstructs container state from the event stream.

## Main Responsibilities

- Apply container events through reducers.
- Replay events in version order.
- Validate event version sequences.
- Reconstruct current aggregate state.
- Query historical state.
- Support state reconstruction around timestamps.
- Support snapshot-based reconstruction.

## Verification

Aggregate replay, reconstruction, historical state, timestamp queries,
and snapshot replay are covered by the backend test suite.

This document is a development reference and does not change runtime
behavior.
