import com.intellij.database.model.DasTable
import com.intellij.database.util.Case
import com.intellij.database.util.DasUtil

/*
 * Available context bindings:
 *   SELECTION   Iterable<DasObject>
 *   PROJECT     project
 *   FILES       files helper
 */

typeMapping = [
  (~/(?i)float|double|decimal|real|int|numeric/)  : "number",
  (~/(?i)datetime|date|timestamp/)                : "date",
  (~/(?i)text|char|varchar|tsvector/)             : "string",
  (~/(?i)/)                                       : 'null'
]
comparisonsMapping = [
        (~/(?i)float|double|decimal|real|int|numeric/)  : "[FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]",
        (~/(?i)datetime|date|timestamp/)                : "[FilterComparison.AFTER, FilterComparison.BEFORE, FilterComparison.IS_BETWEEN]",
        (~/(?i)text|char|varchar/)                      : "[FilterComparison.CONTAINS]",
        (~/(?i)tsvector/)                               : "[FilterComparison.MATCHES]",
        (~/(?i)/)                                       : 'null'
]
FILES.chooseDirectoryAndSave("Choose directory", "Choose where to store generated definition file") { dir ->
  SELECTION.filter { it instanceof DasTable }.each { generate(it, dir) }
}

def generate(table, dir) {
  def className = camelName(table.getName(), false)
  def fields = calcFields(table)
  new File(dir, "${className}Filters.ts").withPrintWriter { out -> generate(out, className, fields) }
}

def generate(out, className, fields) {
  out.println "// generated filter config from database using groovy script"
  out.println "import { FilterComparison } from '../filterComparisons'"
  out.println "import { FilterDatatype } from '../filterDatatypes'"
  out.println "import { IFilterOption } from '../../types/IFilters'"
  out.println ""
  out.println "export const ${className}Filters: IFilterOption[] = ["
  fields.each() {
    if(it.type == 'null'){
      out.println "// skipped ${it.readableName} (${it.name}) because could not find type mapping for '${it.originalType}'"
    }else {
      out.println "{"
      out.println "\tcolumnName: '${it.name}',"
      out.println "\tdataType: FilterDatatype.${it.type},"
      out.println "\tfield: '${it.readableName}',"
      out.println "\tpossibleComparisons: ${it.comparisons}"
      out.println "},"
    }
  }
  out.println "].map((filter) => Object.freeze(filter))\n"
}

def calcFields(table) {
  DasUtil.getColumns(table).reduce([]) { fields, col ->
    def spec = Case.LOWER.apply(col.getDataType().getSpecification())
    def typeStr = typeMapping.find { p, t -> p.matcher(spec).find() }.value
    def comparisons = comparisonsMapping.find { p, t -> p.matcher(spec).find() }.value
      fields += [[
                         name : col.getName(),
                         readableName: readableName(col.getName(), false),
                         type : typeStr,
                         comparisons : comparisons,
                         originalType: spec
                 ]]
  }
}

def readableName(str, capitalize) {
  def s = com.intellij.psi.codeStyle.NameUtil.splitNameIntoWords(str)
          .collect { Case.LOWER.apply(it).toLowerCase() }
          .join(" ")
          .replaceAll(/[^\p{javaJavaIdentifierPart}[_]]/, " ")
  capitalize || s.length() == 1? s : Case.LOWER.apply(s[0]) + s[1..-1]
}

def camelName(str, capitalize) {
  def s = com.intellij.psi.codeStyle.NameUtil.splitNameIntoWords(str)
          .collect { Case.LOWER.apply(it).capitalize() }
          .join("")
          .replaceAll(/[^\p{javaJavaIdentifierPart}[_]]/, "_")
  capitalize || s.length() == 1? s : Case.LOWER.apply(s[0]) + s[1..-1]
}
