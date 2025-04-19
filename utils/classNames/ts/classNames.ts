export type Mods = Record<string, boolean | string>

/**
 * 
 * @param cls - class name
 * @param modsOrAdditional - mods or additional classes
 * @param additional - additional classes
 * @returns {string}
 */
export const classNames = (cls: string, modsOrAdditional: Mods | string[] = {}, additional: string[] = []): string => [
    cls,
    ...(Array.isArray(modsOrAdditional)
      ? modsOrAdditional.filter(Boolean)
      : Object.entries(modsOrAdditional)
        .reduce((acc, [ _cls, value ]) => (
          Boolean(value) && acc.push(_cls),
          acc
        ), [] as string[])),
    ...additional.filter(Boolean),
  ].join(' ')

export default classNames
