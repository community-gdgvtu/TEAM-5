export interface NavParams {
  [key: string]: any;
}

/** Props every screen receives from its role navigator. */
export interface NavScreenProps {
  /** Navigate to another screen in the same stack, with optional params. */
  go: (name: string, params?: NavParams) => void;
  /** Go back one screen. */
  back: () => void;
  /** Params passed by `go(...)`. */
  params?: NavParams;
}